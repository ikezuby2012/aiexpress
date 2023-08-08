const allRoles = {
  rental: ["createTool", "updateTool"],
  borrower: ["getTools", "makePayment"],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(allRoles)
);
