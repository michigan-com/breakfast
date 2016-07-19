export default function storeLocals() {
  return function (req, res, next) {
    res.locals.node_env = process.env.NODE_ENV;
    res.locals.user = req.user;
    next();
  };
}
