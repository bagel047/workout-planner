import chestImg from "../assets/muscle_groups/chest.png";
import backImg from "../assets/muscle_groups/back.png";
import shouldersImg from "../assets/muscle_groups/shoulders.png";
import bicepsImg from "../assets/muscle_groups/biceps.png";
import tricepsImg from "../assets/muscle_groups/triceps.png";
import legsImg from "../assets/muscle_groups/legs.png";
import glutesImg from "../assets/muscle_groups/glutes.png";
import hamstringsImg from "../assets/muscle_groups/hamstrings.png";
import quadsImg from "../assets/muscle_groups/quads.png";
import coreImg from "../assets/muscle_groups/chest.png";
import cardioImg from "../assets/muscle_groups/chest.png";
import fullBodyImg from "../assets/muscle_groups/chest.png";

export const muscleGroupImages = {
  CHEST: chestImg,
  BACK: backImg,
  SHOULDERS: shouldersImg,
  BICEPS: bicepsImg,
  TRICEPS: tricepsImg,
  LEGS: legsImg,
  GLUTES: glutesImg,
  HAMSTRINGS: hamstringsImg,
  QUADS: quadsImg,
  CORE: coreImg,
  CARDIO: cardioImg,
  FULL_BODY: fullBodyImg,
};

// export const goalImages = {
//   MUSCLE_GAIN: muscleImg,
//   FAT_LOSS: fatLossImg,
//   STRENGTH: strengthImg,
//   ENDURANCE: enduranceImg,
//   FLEXIBILITY: flexibilityImg,
//   GENERAL_FITNESS: generalImg,
// };

export default function Exercise({ exercise }) {
  const sourceLabel = (source) => {
    if (source === "SYSTEM")
      return { label: "SYSTEM", color: "bg-white/10 text-white/40" };
    if (source === "USER")
      return { label: "MINE", color: "bg-[#443a35]/60 text-[#e4ddcc]" };
    if (source === "AI")
      return { label: "AI", color: "bg-purple-900/40 text-purple-300" };
    return { label: source, color: "bg-white/10 text-white/40" };
  };

  const levelColor = (level) => {
    if (level === "BEGINNER") return "text-green-400";
    if (level === "INTERMEDIATE") return "text-yellow-400";
    if (level === "ADVANCED") return "text-red-400";
    return "text-white/40";
  };

  const src = sourceLabel(exercise.source);
  return (
    <div
      key={exercise.id}
      onClick={() => navigate(`/exercises/${exercise.id}`)}
      className="rounded-xl overflow-hidden cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all group"
    >
      {/* Image placeholder — muscle group icon */}
      <div className="relative h-28 bg-white/[0.03] flex items-center justify-center overflow-hidden">
        <img
          className="absolute w-full h-full object-cover"
          src={muscleGroupImages[exercise.muscleGroup]}
          alt={exercise.muscleGroup}
        />

        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/0 transition-all duration-300" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#443a35]/95 via-[#251b15]/45 to-transparent transition-all duration-300" /> */}

        {/* <p className="absolute bottom-0 left-4 right-2 z-10 text-[#f8f4ee] text-sm font-medium leading-snug mb-2 group-hover:text-white transition-colors">
          {exercise.name}
        </p> */}
      </div>

      <div className="p-3">
        <p className="text-[#f8f4ee] text-sm font-medium leading-snug mb-2 group-hover:text-white transition-colors">
          {exercise.name}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/45">
            {exercise.muscleGroup}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-white/45">
            {exercise.equipmentType}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] ${levelColor(exercise.difficultyLevel)}`}
          >
            {exercise.difficultyLevel?.charAt(0) +
              exercise.difficultyLevel?.slice(1).toLowerCase()}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${src.color}`}>
            {src.label}
          </span>
        </div>
      </div>
    </div>
  );
}
