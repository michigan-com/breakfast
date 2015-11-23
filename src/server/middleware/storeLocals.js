export default function storeLocals() {
  return function (req, res, next) {
    res.locals.user = req.user;
    next();
  }
}
