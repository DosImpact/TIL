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
      label: "typescript",
      items: [
        `${FULLSTACK_Folder}/typescript/basicType`,
        `${FULLSTACK_Folder}/typescript/interface01`,
      ],
      collapsed: true,
    },
    {
      type: "category",
      label: "AI",
      items: [`${FULLSTACK_Folder}/ai/numpy`],
      collapsed: true,
    },
    {
      type: "category",
      label: "apollo",
      items: [`${FULLSTACK_Folder}/apollo/apollo-cli`],
      collapsed: true,
    },
    {
      type: "category",
      label: "dom",
      items: [`${FULLSTACK_Folder}/dom/events`],
      collapsed: true,
    },
    {
      type: "category",
      label: "NestJS",
      items: [
        `${FULLSTACK_Folder}/nestjs/nestjs-restapi`,
        `${FULLSTACK_Folder}/nestjs/nestjs-graphql-api`,
        `${FULLSTACK_Folder}/nestjs/nestjs-prisma`,
        `${FULLSTACK_Folder}/nestjs/nestjs-msa-01`,
        `${FULLSTACK_Folder}/nestjs/nestjs-e2e`,
        `${FULLSTACK_Folder}/graphql/graphql-pubsub01`,
        `${FULLSTACK_Folder}/typeorm/typeorm_model01`,
        `${FULLSTACK_Folder}/graphql/graphql-pubsub01`,
      ],
      collapsed: true,
    },
    {
      type: "category",
      label: "NestJS Auth",
      items: [
        `${FULLSTACK_Folder}/nestjs-auth/nestjs-auth-01`,
        `${FULLSTACK_Folder}/nestjs-auth/nestjs-auth-02`,
        `${FULLSTACK_Folder}/nestjs-auth/nestjs-auth-03`,
        `${FULLSTACK_Folder}/nestjs-auth/nestjs-auth-04`,
      ],
      collapsed: true,
    },
    {
      type: "category",
      label: "React",
      items: [
        `${FULLSTACK_Folder}/react/design/slot`,
        `${FULLSTACK_Folder}/react/setting`,
        `${FULLSTACK_Folder}/react/hooks/react-hook-form`,
        `${FULLSTACK_Folder}/react/hooks/use-modal`,
        `${FULLSTACK_Folder}/react/hooks/useContext`,
        `${FULLSTACK_Folder}/react/hooks/usePersistState`,
        `${FULLSTACK_Folder}/react/optimize/memo`,
      ],
      collapsed: true,
    },

    // ========== DB_Folder ====================
    {
      type: "doc",
      id: `${DB_Folder}/schema`,
      items: [`${DB_Folder}/sql/mysqlRead`],
    },
    {
      type: "category",
      label: "Guides",
      items: [{ Docs: ["doc1", "doc2", "doc3"] }, "test", "sample/test"],
      collapsed: true,
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
      collapsed: true,
    },

    // ========== CS_Folder ====================
    {
      type: "doc",
      id: `${CS_Folder}/schema`,
    },
    {
      type: "category",
      label: "algorithm",
      items: [
        `${CS_Folder}/algorithm/ds/trie`,
        `${CS_Folder}/algorithm/bruteForce`,
        `${CS_Folder}/algorithm/dp01`,
        `${CS_Folder}/algorithm/dp02`,
        `${CS_Folder}/algorithm/graph01`,
        `${CS_Folder}/algorithm/syntax/python02`,
        `${CS_Folder}/algorithm/syntax/python03`,
        `${CS_Folder}/algorithm/search/ternerySearch`,
        `${CS_Folder}/algorithm/math/base`,
        `${CS_Folder}/algorithm/math/getPirmes`,
        `${CS_Folder}/algorithm/sort`,
        `${CS_Folder}/algorithm/strategery`,
      ],
      collapsed: true,
    },
    {
      type: "category",
      label: "Front",
      items: [`${CS_Folder}/Front/svelte`],
      collapsed: true,
    },
    {
      type: "category",
      label: "HTTP",
      items: [`${CS_Folder}/HTTP/cache`],
      collapsed: true,
    },
    {
      type: "category",
      label: "MSA",
      items: [
        `${CS_Folder}/MSA/MSA-1`,
        `${CS_Folder}/MSA/MSA-2`,
        `${CS_Folder}/MSA/MSA-3`,
        `${CS_Folder}/MSA/MSA-4`,
        `${CS_Folder}/MSA/MSA-5`,
        `${CS_Folder}/MSA/MSA-6`,
        `${CS_Folder}/MSA/Redis`,
      ],
      collapsed: true,
    },
    {
      type: "category",
      label: "Seminar",
      items: [`${CS_Folder}/seminar/recommandServer`],
      collapsed: true,
    },
    // ========== ETC_Folder ====================
    {
      type: "doc",
      id: `${ETC_Folder}/schema`,
    },
    {
      type: "category",
      label: "blog",
      items: [`${ETC_Folder}/blog/lectures`],
      collapsed: true,
    },
    {
      type: "category",
      label: "employ",
      items: [`${ETC_Folder}/employ/feedsite`],
      collapsed: true,
    },
    {
      type: "category",
      label: "stock",
      items: [`${ETC_Folder}/stock/basic01`],
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
