import config from "../config/config";

const globalDataController = {
  getColors: () => {
    return config.COLORS;
  },
};

export default globalDataController;
