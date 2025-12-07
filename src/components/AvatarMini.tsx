import "./AvatarMini.css";

export default function AvatarMini({ avatar }) {
    if (!avatar) return null;

    return (
        <div className="mini-avatar-box">

            {/* TOP */}
            <img
                src={`/images/avatar/top/${avatar.top}.svg`}
                className={`mini-top mini-top-${avatar.top}`}
            />

            {/* EARS */}
            <img
                src={`/images/avatar/ears/${avatar.ears}.svg`}
                className="mini-ears"
            />

            {/* HAIR */}
            <img
                src={`/images/avatar/hair/${avatar.hair}.svg`}
                className="mini-hair"
            />

            {/* EYES */}
            <img
                src={`/images/avatar/eyes/${avatar.eyes}.svg`}
                className="mini-eyes"
            />

            {/* MOUTH */}
            <img
                src={`/images/avatar/mouth/${avatar.mouth}.svg`}
                className="mini-mouth"
            />

            {/* HAT */}
            {avatar.hat !== "none" && (
                <img
                    src={`/images/avatar/hat/${avatar.hat}.svg`}
                    className={`mini-hat mini-hat-${avatar.hat}`}
                />
            )}
        </div>
    );
}
