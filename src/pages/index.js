import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "TypeScript",
    imageUrl:
      "https://res.cloudinary.com/practicaldev/image/fetch/s--LkL103Qa--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/landscape/typescriptlang.png",
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: "React TSX",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: "Nest JS",
    imageUrl:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/fecece74182713.5c254609b1588.png",
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
  {
    title: "puppeteer",
    imageUrl: "https://i.morioh.com/8a98fb34de.png",
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },
];

const mainProject = [
  {
    title: "TypeScript",
    imageUrl:
      "https://res.cloudinary.com/practicaldev/image/fetch/s--LkL103Qa--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/landscape/typescriptlang.png",
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img
            style={{ objectFit: "contain" }}
            className={styles.featureImage}
            src={imgUrl}
            alt={title}
          />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              🚀 TIL ( Today I Learned )
            </Link>
          </div>
        </div>
      </header>

      <main className="mainSection">
        <div className="mainSectionTitle">Skills</div>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <main className="mainSection">
        <div className="mainSectionTitle">Project</div>
        {mainProject && mainProject.length > 0 && (
          <section className={styles.mainProject}>
            <div className="container">
              <div className="row">
                {mainProject.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
