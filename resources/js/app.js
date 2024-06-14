import flCalculator from "./flCalculator";
document.addEventListener("alpine:init", () => {
  Alpine.data("flCalculator", flCalculator);
});
