const FULLSTACK_Folder = "1_fullstack";
const DB_Folder = "2_DB";
const DEVOPS_Folder = "3_devops";
const CS_Folder = "4_cs";
const ETC_Folder = "5_etc";

const sideBars = {
  docs: [
    // ========== FULLSTACK_Folder ====================
    {
      type: "doc",
      id: `${FULLSTACK_Folder}/schema`,
    },
    {
      type: "category",
      label: "Styles",
      items: ["mdx"],
      collapsed: false,
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
      collapsed: false,
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
      collapsed: false,
    },

    // ========== CS_Folder ====================
    {
      type: "doc",
      id: `${CS_Folder}/schema`,
    },
    {
      type: "category",
      label: "MSA",
      items: [`${CS_Folder}/MSA/MSA-1`],
      collapsed: true,
    },
    // ========== ETC_Folder ====================
    {
      type: "doc",
      id: `${ETC_Folder}/schema`,
    },
    {
      type: "category",
      label: "employ",
      items: [`${ETC_Folder}/employ/feedsite`],
      collapsed: true,
    },
    {
      type: "category",
      label: "util",
      items: [`${ETC_Folder}/util/PasteIntoFile`],
      collapsed: true,
    },
  ],
};
module.exports = sideBars;
