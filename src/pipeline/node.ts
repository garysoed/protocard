import Cache from '../decorators/cache';

abstract class Node<T> {
  private dependencies_: Node<any>[];
  private isDone_: boolean;
  private listeners_: Set<Function>;

  constructor(dependencies: Node<any>[]) {
    this.dependencies_ = dependencies;
    this.isDone_ = false;
    this.listeners_ = new Set<Function>();

    dependencies.forEach(dependency => {
      dependency.addChangeListener(this.onChange_.bind(this));
    });
  }

  abstract runHandler_(dependencyResults: any[]): Promise<T>;

  /**
   * Called when any of the dependencies has changed.
   */
  private onChange_() {
    this.refresh();
  }

  /**
   * Runs all the dependencies, then run the handler of this node.
   */
  @Cache
  private run_(): Promise<T> {
    return Promise.all(this.dependencies_.map(dependency => dependency.result))
        .then(results => this.runHandler_(results))
        .then(
            result => {
              this.isDone_ = true;
              this.listeners_.forEach(listener => listener());
              return result;
            },
            error => {
              this.listeners_.forEach(listener => listener());
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
    return this.dependencies_.every(dependency => dependency.isDone);
  }

  get isDone(): boolean {
    this.run_();
    return this.isDone_;
  }

  /**
   * Clears all the cache and prepares the node to be ran again.
   */
  refresh() {
    Cache.clear(this);
    this.isDone_ = false;
    this.run_();
  }

  get result(): Promise<T> {
    return this.run_();
  }
};

export default Node;
