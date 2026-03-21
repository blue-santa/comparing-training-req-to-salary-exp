# Comparing Training vs Salary

## Capstone Two: Project Proposal

# Problem Identification

Job seekers face a challenge. The cost of training, both in terms of finances and time spent, varies widely across industries. Some types of training are expensive while others provide paid apprenticeships. The financial results of these training pathways vary widely in turn. The relationship between the investment and the return on that investment is not always apparent to a jobseeker. Without understanding this relationship, jobseekers may find themselves pouring their energy into a career pathway that will not provide them with a justifiable reward.

# Context

This research project intends to explore the relationship between investment required in a career-training program and the expected salary one can earn. Various cross-sections of research may be performed as a part of this project. For example, the project may compare overall training cost per industry against industry expected salaries. In another possible inclusion, the project may explore the amount of time it takes to train for any job, regardless of industry, and compare that against overall financial outcomes.

# Criteria for Success

The aim of the project is to show a broad spectrum of relationships between time and financial resources spent compared to the financial outcomes. The project will be deemed successful when it is able to show clearly and in visual format the requirements and rewards across a wide range of industries and situations. Several highlights will be provided from the resulting data. As the project develops and highlights are discovered, the project may deepen with a focus on those areas to provide insight to job seekers.  

# Scope of Solution Space

The solution space will focus on publicly available data, comparing known career-training requirements and salary expectations. Datasets will be downloaded locally and loaded into a PostgreSQL database. The data will be accessed via Jupyter Notebook, wrangled and cleaned using tools such as Pandas and Numpy, and the resulting metadata will be saved back into the PostgreSQL database.   
With the data cleaned, various types of analysis will be performed. Relationships between training time and cost will be explored across salary outputs, with various cross-sections performed according to industry and other features.  
With the relationships established, visualizations will be created. Seaborn and Matplotlib will be used as preliminary visualization tools.  
As time allows, the project may expand to include the use of tools such as Apache Superset and other professional-grade data-driven storytelling tools.  
The final output may be a shareable and downloadable PDF that contains informative slides and a project report. Additionally, as time allows, the project may include a downloadable Github project that allows for a small level of interactivity within an Apache Superset instance.

# Stakeholders

The target audience for this data exploration is prospective jobseekers. This presentation will be made available online as a resource that anyone can download or view for their personal benefit.   
Ideally, the dataset may provide insight for jobseekers who are deciding between various career paths and are still at a stage of career progression where this information can inform their decision-making process.

# Constraints

This exploration is constrained to existing datasets that are publicly available. The exploration is also constrained to limit the output according to what explorations and visualizations can be output by one individual working independently as an avocation, and within a reasonably short amount of time. 

# Data Sources

The primary two datasets that will be used for this exploration are the O\*NET and BLS Wage Data datasets. The datasets have joinable identifiers on occupational id types.

## O\*NET

The O\*NET dataset contains a collection of information about skill sets, training, education, and occupational information.  
[https://www.onetcenter.org/database.html\#all-files](https://www.onetcenter.org/database.html#all-files)

## BLS Wage Data

The BLS Wage Data dataset contains information about various industries and their associated expected salaries.   
[https://www.bls.gov/oes/](https://www.bls.gov/oes/) 
