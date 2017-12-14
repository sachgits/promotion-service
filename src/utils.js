function cbToCb(cb) {
  return typeof cb === 'function' ? cb : noop;
}

function noop() {}

export { cbToCb, noop };
