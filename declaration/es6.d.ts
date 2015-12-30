interface MapConstructor {
  new <K, V>(iterable: (K|V)[][]): Map<K, V>;
}
