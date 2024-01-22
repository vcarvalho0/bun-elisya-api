const App = {
  config: {
    port: Number(process.env.PORT)
  },
  logger: {
    enabled: process.env.ENABLED,
    level: process.env.LEVEL
  }
};

export default App;
