import { mountApplication } from "./mount";
import "./styles/global.css";

export const applicationRoot = mountApplication(document.getElementById("root"));
