import "./CircularLoading.css";

export default function CircularLoading() {
  return (
    <div class="component__circular-loading">
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
}
