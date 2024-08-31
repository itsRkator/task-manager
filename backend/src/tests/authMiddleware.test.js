const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    next = sinon.spy();
  });

  it("should return 401 if authorization header is missing", () => {
    authMiddleware(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Authorization header missing" })).to
      .be.true;
  });

  it("should return 401 if token type is not Bearer", () => {
    req.headers.authorization = "Basic token";
    authMiddleware(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Invalid token type" })).to.be.true;
  });

  it("should return 401 if token is missing", () => {
    req.headers.authorization = "Bearer";
    authMiddleware(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Token missing" })).to.be.true;
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalidToken";
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Invalid token" })).to.be.true;

    jwt.verify.restore();
  });

  it("should call next if token is valid", () => {
    req.headers.authorization = "Bearer validToken";
    const decoded = { id: "userId" };
    sinon.stub(jwt, "verify").returns(decoded);

    authMiddleware(req, res, next);

    expect(req.user).to.deep.equal(decoded);
    expect(next.called).to.be.true;

    jwt.verify.restore();
  });
});
