import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export default convex;
