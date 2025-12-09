# CoreLab Analytics

**A quantitative research platform and visualization tool for BSIT academic performance analysis.**

This project serves as the digital integration for the research study: *"The Relationship Between Computer Laboratory Usage and Preliminary and Midterm Performance in Selected Core BSIT Subjects at STI College Malolos."*

## Project Overview

CoreLab Analytics bridges the gap between raw statistical data and actionable educational insights. It allows researchers and administrators to visualize how laboratory usage frequency (hours/week) and intensity (hands-on percentage) correlate with student grade shifts between Preliminary and Midterm periods.

### Key Features

* **Dynamic Dashboard** — In-browser CSV parsing using PapaParse to generate real-time charts.
* **Automated Statistical Analysis** — Client-side calculation of Pearson *r* correlation and linear regression slopes.
* **Interactive Visualizations** — Scatter plots with trend lines and comparative bar charts using Chart.js.
* **Response Handling** — Integrated Google Forms embed with a mandatory informed consent gate.
* **Research Documentation** — accessible theoretical framework, methodology, and full manuscript download.

## Technology Stack

This project utilizes a modern static architecture with no backend dependencies, ensuring high portability and security.

* **Structure** — HTML5, Semantic Web Standards
* **Styling** — Tailwind CSS (via CDN) with a centralized configuration strategy
* **Logic** — jQuery (3.7.1) for DOM manipulation and component loading
* **Data Processing** — PapaParse (CSV Parsing)
* **Visualization** — Chart.js (Data Rendering)

## Directory Structure

```text
/
├── assets/
│   ├── css/       # Global styles and Tailwind overrides
│   ├── js/        # Application logic and statistical calculations
│   ├── images/    # Branding assets and hero backgrounds
│   └── docs/      # Research manuscript (PDF)
├── components/    # Reusable fragments (Header, Footer)
└── [pages].html   # Core views (Index, Dashboard, Survey, Team)
