export const getInitialState = () => ({
  accounts: {
    // ...getInitialAccountState()
  },
  isLoading: false,
  lastLoaded: null,

  hasLoadedAProjectBefore: false,
});

export const getInitialTeamBacklogState = (backlog, currentBacklog) => ({
  id: backlog.id,
  name: backlog.name,
  type: backlog.type,
  core: backlog,
  
  isActive: currentBacklog?.isActive || false,

  items: currentBacklog?.items || [],
  isLoadingItems: currentBacklog?.isLoadingItems || false,
  lastLoadedItems: currentBacklog?.lastLoadedItems || null,
});

export const getInitialTeamIterationState = (iteration, currentIteration) => ({
  id: iteration.id,
  name: iteration.name,
  type: iteration.type,
  core: iteration,

  isActive: currentIteration?.isActive || false,

  items: currentIteration?.items || [],
  isLoadingItems: currentIteration?.isLoadingItems || false,
  lastLoadedItems: currentIteration?.lastLoadedItems || null,
});

export const getInitialTeamState = (team, currentTeam) => ({
  id: team.id,
  name: team.name,
  isActive: currentTeam?.isActive || false,

  core: team,

  backlogs: currentTeam?.backlogs || [
    // getInitialTeamBacklogState(backlog)
  ],
  isLoadingBacklogs: currentTeam?.isLoadingBacklogs || false,
  lastLoadedBacklogs: currentTeam?.lastLoadedBacklogs || null,

  iterations: currentTeam?.iterations || [
    // getInitialTeamIterationState(iteration)
  ],
  isLoadingIterations: currentTeam?.isLoadingIterations || false,
  lastLoadedIterations: currentTeam?.lastLoadedIterations || null,
});

export const getInitialAccountState = (accountName) => ({
  [accountName]: {
    projects: [
      // getInitialProjectState(id, name, description),
    ],
    isLoading: false,
    lastLoaded: null,
  },
});

export const getInitialProjectState = (project, accountName, currentProject) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  core: project,
  accountName,

  isActive: currentProject?.isActive || false,

  config: currentProject?.config || {},
  isLoadingConfig: currentProject?.isLoadingConfig || false,
  lastLoadedConfig: currentProject?.lastLoadedConfig || null,
  
  about: currentProject?.about || {},
  isLoadingAbout: currentProject?.isLoadingAbout || false,
  lastLoadedAbout: currentProject?.lastLoadedAbout || null,

  teams: currentProject?.teams || [
    // getInitialTeamState(team)
  ],
  isLoadingTeams: currentProject?.isLoadingTeams || false,
  lastLoadedTeams: currentProject?.lastLoadedTeams || null,
});

//
// State helpers
//

export const getActiveProject = (state) => {
  for (const key in state.accounts) {
    const activeProject = state.accounts[key].projects.find(project => project.isActive);
    if (activeProject) {
      return activeProject;
    } 
  }
};

export const getActiveTeam = (state, projectId) => {
  for (const key in state.accounts) {
    for (const project of state.accounts[key].projects) {
      if (project.id === projectId) {
        return project.teams.find(team => team.isActive);
      }
    }
  }
};

export const getActiveBacklog = (state, projectId, teamId) => {
  for (const key in state.accounts) {
    for (const project of state.accounts[key].projects) {
      if (project.id === projectId) {
        for (const team of project.teams) {
          if (team.id === teamId) {
            return team.backlogs.find(backlog => backlog.isActive);
          }
        }
      }
    }
  }
};

export const getActiveIteration = (state, projectId, teamId) => {
  for (const key in state.accounts) {
    for (const project of state.accounts[key].projects) {
      if (project.id === projectId) {
        for (const team of project.teams) {
          if (team.id === teamId) {
            return (team.iterations || []).find(iteration => iteration.isActive);
          }
        }
      }
    }
  }
};

export const getWorkItems = (state, projectId, teamId, backlogId) => {
  for (const key in state.accounts) {
    for (const project of state.accounts[key].projects) {
      if (project.id === projectId) {
        for (const team of project.teams) {
          if (team.id === teamId) {
            for (const backlog of team.backlogs) {
              if (backlog.id === backlogId) {
                return backlog.items;
              }
            }
          }
        }
      }
    }
  }
};

//
// Reducer helpers
//

export const setActiveProject = (state, projectId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isActive = true;
      } else {
        project.isActive = false;
      }

      return project;
    })
  }

  return state;
};

export const requestProjects = (state, accountName) => {
  if (!state.accounts[accountName]) {
    state.accounts = {
      ...state.accounts,
      ...getInitialAccountState(accountName),
    };
  }

  state.accounts[accountName].isLoading = true;

  return state;
};

export const receiveProjects = (state, accountName, projects) => {
  // Ensure the key exists for this account
  state = requestProjects(state, accountName);

  state.accounts[accountName].isLoading = false;
  state.accounts[accountName].lastLoaded = Date.now();

  state.accounts[accountName].projects = projects.map(project => {
    const currentProject = state.accounts[accountName].projects.find(_currentProject => _currentProject.id === project.id);
    return getInitialProjectState(project, accountName, currentProject);
  });

  if (!state.accounts[accountName].projects.find(project => project.isActive)) {
    state.accounts[accountName].projects[0].isActive = true;
  }

  return state;
};

export const setHasLoadedAProjectBefore = (state, hasLoadedAProjectBefore = true) => {
  state.hasLoadedAProjectBefore = hasLoadedAProjectBefore;
  return state;
};

export const requestProjectConfig = (state, projectId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingConfig = true;
      }

      return project;
    });
  }

  return state;
};

export const receiveProjectConfig = (state, projectId, config) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingConfig = false;
        project.lastLoadedConfig = Date.now();
        project.config = config;
      }

      return project;
    });
  }

  return state;
};

export const requestProjectAbout = (state, projectId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingAbout = true;
      }

      return project;
    });
  }

  return state;
};

export const receiveProjectAbout = (state, projectId, about) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingAbout = false;
        project.lastLoadedAbout = Date.now();
        project.about = about;
      }

      return project;
    });
  }

  return state;
};

export const requestProjectTeams = (state, projectId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingTeams = true;
      }

      return project;
    });
  }

  return state;
};

export const receiveProjectTeams = (state, projectId, teams) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.isLoadingTeams = false;
        project.lastLoadedTeams = Date.now();
        project.teams = teams.map(team => {
          const currentTeam = project.teams.find(_currentTeam => _currentTeam.id === team.id);
          return getInitialTeamState(team, currentTeam);
        });

        if (!project.teams.find(team => team.isActive)) {
          project.teams[0].isActive = true;
        }
      }

      return project;
    });
  }

  return state;
};

export const setActiveTeam = (state, projectId, teamId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.isActive = true;
          } else {
            team.isActive = false;
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const requestProjectBacklogs = (state, projectId, teamId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.isLoadingBacklogs = true;
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const receiveProjectBacklogs = (state, projectId, teamId, backlogs) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.isLoadingBacklogs = false;
            team.lastLoadedBacklogs = Date.now();
            team.backlogs = backlogs.map(backlog => {
              const currentBacklog = team.backlogs.find(_currentBacklog => _currentBacklog.id === backlog.id);
              return getInitialTeamBacklogState(backlog, currentBacklog);
            });

            if (team.backlogs.length && !team.backlogs.find(backlog => backlog.isActive)) {
              team.backlogs[0].isActive = true;
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const setActiveBacklog = (state, projectId, teamId, backlogId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.backlogs = team.backlogs.map(backlog => {
              if (backlog.id === backlogId) {
                backlog.isActive = true;
                backlog.isLoadingItems = true;
              } else {
                backlog.isActive = false;
              }

              return backlog;
            });

          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const requestBacklogWorkItems = (state, projectId, teamId, backlogId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            for (const backlog of team.backlogs) {
              if (backlog.id === backlogId) {
                backlog.isLoadingItems = true;
              }
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const receiveBacklogWorkItems = (state, projectId, teamId, backlogId, items) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            for (const backlog of team.backlogs) {
              if (backlog.id === backlogId) {
                backlog.isLoadingItems = false;
                backlog.lastLoadedItems = Date.now();
                backlog.items = items;
              }
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const requestProjectIterations = (state, projectId, teamId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.isLoadingIterations = true;
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const receiveProjectIterations = (state, projectId, teamId, iterations) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.isLoadingIterations = false;
            team.lastLoadedIterations = Date.now();
            team.iterations = iterations.map(iteration => {
              const currentIteration = team.iterations.find(_currentIteration => _currentIteration.id === iteration.id);
              return getInitialTeamIterationState(iteration, currentIteration);
            });

            if (team.iterations.length && !team.iterations.find(iteration => iteration.isActive)) {
              team.iterations[0].isActive = true;
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const setActiveIteration = (state, projectId, teamId, iterationId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            team.iterations = team.iterations.map(iteration => {
              if (iteration.id === iterationId) {
                iteration.isActive = true;
              } else {
                iteration.isActive = false;
              }

              return iteration;
            });
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const requestIterationWorkItems = (state, projectId, teamId, iterationId) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            for (const iteration of team.iterations) {
              if (iteration.id === iterationId) {
                iteration.isLoadingItems = true;
              }
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};

export const receiveIterationWorkItems = (state, projectId, teamId, iterationId, items) => {
  for (const key in state.accounts) {
    state.accounts[key].projects = state.accounts[key].projects.map(project => {
      if (project.id === projectId) {
        project.teams = project.teams.map(team => {
          if (team.id === teamId) {
            for (const iteration of team.iterations) {
              if (iteration.id === iterationId) {
                iteration.isLoadingItems = false;
                iteration.lastLoadedItems = Date.now();
                iteration.items = items;
              }
            }
          }

          return team;
        });
      }

      return project;
    });
  }

  return state;
};
