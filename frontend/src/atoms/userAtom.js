import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default:
    JSON.parse(localStorage.getItem("user-threads", "currentUser")) || null,
});

export default userAtom;
