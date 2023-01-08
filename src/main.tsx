import * as React from 'react'
import { createRoot } from 'react-dom/client'
import emotionReset from "emotion-reset";
import { Global, css } from "@emotion/react";
import { ExtractPage } from "@/pages/ExtractPage";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Global
      styles={css`
        ${emotionReset}

        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }
      `}
    />
    <ExtractPage />
  </React.StrictMode>
);
