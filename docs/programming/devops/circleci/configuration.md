# Configuration

CircleCI believes in _configuration_ as code. Your entire CI/CD process is orchestrated through a single file called `config.yml`. The `config.yml` file is located in a folder called `.circleci` at the root of your project that defines the entire pipeline.

Example of a directory setup using CircleCI:

```yaml
├── .circleci
│   ├── config.yml
├── README
└── all-other-project-files-and-folders
```

Your CircleCI configuration can be adapted to fit many different needs of your project.

Here are the most important terms you should know:

- **Pipeline**: Represents the entirety of your configuration.
- **Workflows**: Responsible for orchestrating multiple jobs.
- **Jobs**: Responsible for running a series of steps that perform commands.
- **Steps**: Run commands (such as installing dependencies or running tests) and shell scripts to do the work required for your project.
