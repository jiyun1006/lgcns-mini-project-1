import LeftProfile from "../organisms/LeftProfile";
import RightProfile from "../organisms/RightProfile";
import AvatarCoreIdentity from "../organisms/AvatarCoreIdentity";

export default function RenderProfileLinkSection() {
  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
        <LeftProfile />
        <RightProfile />
      </div>
      <div>
        <AvatarCoreIdentity />
      </div>
    </>
  );
}
