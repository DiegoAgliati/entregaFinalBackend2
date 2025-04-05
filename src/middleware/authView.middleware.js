export const userToViews = (req, res, next) => {
  res.locals.user = req.user || null;
  next();
};