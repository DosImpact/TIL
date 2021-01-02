const FULLSTACK_Folder = "1_fullstack";
const DB_Folder = "2_DB";
const DEVOPS_Folder = "3_devops";

const sideBars = {
  docs: [
    {
      type: "category",
      label: "employ",
      items: ["employ/feedsite"],
    },
    // ========== FULLSTACK_Folder ====================
    {
      type: "doc",
      id: `${FULLSTACK_Folder}/schema`,
    },
    {
      type: "category",
      label: "Styles",
      items: ["mdx"],
    },
    // ========== DB_Folder ====================
    {
      type: "doc",
      id: `${DB_Folder}/schema`,
    },
    {
      type: "category",
      label: "Guides",
      items: [{ Docs: ["doc1", "doc2", "doc3"] }, "test", "sample/test"],
    },
    // ========== DEVOPS_Folder ====================
    {
      type: "doc",
      id: `${DEVOPS_Folder}/schema`,
    },
    {
      type: "category",
      label: "github",
      items: [`${DEVOPS_Folder}/github/style/badge`],
    },
  ],
};
module.exports = sideBars;
