import BaseListenable from '../../node_modules/gs-tools/src/event/base-listenable';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';

export enum EventType {
  CHANGED
}

abstract class Node<T> extends BaseListenable<EventType> {
  private dependencies_: Node<any>[];
  private isDone_: boolean;
  private listeners_: Set<Function>;

  constructor(dependencies: Node<any>[]) {
    super();
    this.dependencies_ = dependencies;
    this.isDone_ = false;
    this.listeners_ = new Set<Function>();

    dependencies.forEach((dependency: Node<any>) => {
      dependency.addChangeListener(this.onChange_.bind(this));
    });
  }

  abstract runHandler_(dependencyResults: any[]): Promise<T>;

  /**
   * Called when any of the dependencies has changed.
   */
  private onChange_(): void {
    this.refresh();
  }

  /**
   * Runs all the dependencies, then run the handler of this node.
   */
  @Cache()
  private run_(): Promise<T> {
    return Promise.all(this.dependencies_.map((dependency: Node<any>) => dependency.result))
        .then((results: any) => this.runHandler_(results))
        .then(
            (result: T) => {
              this.isDone_ = true;
              this.listeners_.forEach((listener: Function) => listener());
              this.dispatch(EventType.CHANGED);
              return result;
            },
            (error: any) => {
              this.listeners_.forEach((listener: Function) => listener());
              this.dispatch(EventType.CHANGED);
            });
  }

  /**
   * Adds a listener to listen to changes to this node.
   */
  addChangeListener(listener: Function): Function {
    this.listeners_.add(listener);
    return () => {
      this.listeners_.delete(listener);
    };
  }

  get isDependenciesDone(): boolean {
    this.run_();
    return this.dependencies_.every((dependency: Node<any>) => dependency.isDone);
  }

  get isDone(): boolean {
    this.run_();
    return this.isDone_;
  }

  /**
   * Clears all the cache and prepares the node to be ran again.
   */
  refresh(): void {
    Cache.clear(this);
    this.isDone_ = false;
    this.run_();
  }

  get result(): Promise<T> {
    return this.run_();
  }
};

export default Node;
