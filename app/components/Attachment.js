import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";

export default function Attachment({
  link,
  showRemoveButton = false,
  handleRemoveFileButtonClick,
}) {
  return (
    <a href={link} target="_blank" className="h-16 relative">
      {showRemoveButton && (
        <button
          onClick={(e) => handleRemoveFileButtonClick(e, link)}
          className="-right-2 -top-2 absolute bg-red-400 p-1 rounded-md text-white"
        >
          <Trash />
        </button>
      )}
      {/.(jpg|png)$/.test(link) ? (
        <img className="h-16 w-auto rounded-md" src={link} alt="" />
      ) : (
        <div className="bg-gray-200 h-16 p-2 flex items-center rounded-md">
          <PaperClip className="size-4" />
          {link.split("/")[3].substring(13)}
        </div>
      )}
    </a>
  );
}
