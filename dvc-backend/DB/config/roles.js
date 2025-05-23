const roles = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

const rolePermissions = {
  admin: ["*"],
  teacher: [
    "read_students",
    "create_attendance",
    "read_attendance",
    "create_result",
    "read_result",
    "read_schedule",
  ],
  student: [
    "read_own_profile",
    "read_own_attendance",
    "read_own_result",
    "read_schedule",
  ],
  parent: ["read_child_profile", "read_child_attendance", "read_child_result"],
};

module.exports = { roles, rolePermissions };
