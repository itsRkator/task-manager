const { expect } = require("chai");
const { filterUser } = require("../../utils/utilityFunctions");

describe("Utility Functions", () => {
  describe("filterUser", () => {
    it("should return filtered user object", () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        _id: "123",
        email: "john.doe@example.com",
        avatar: "avatar.jpg",
      };
      const result = filterUser(user);
      expect(result).to.deep.equal({
        firstName: "John",
        lastName: "Doe",
        id: "123",
        email: "john.doe@example.com",
        avatar: "avatar.jpg",
      });
    });

    it("should handle missing fields", () => {
      const user = { firstName: "John" };
      const result = filterUser(user);
      expect(result).to.deep.equal({
        firstName: "John",
        lastName: "",
        id: "",
        email: "",
        avatar: "",
      });
    });

    it("should throw an error if input is not an object", () => {
      expect(() => filterUser(null)).to.throw("Invalid user object");
    });
  });
});
