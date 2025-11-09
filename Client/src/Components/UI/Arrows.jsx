import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="absolute right-2 top-1/2 transform bg-base-100 -translate-y-1/2 z-10 cursor-pointer text-green-900 hover:text-green-700 rounded-full"
            onClick={onClick}
        >
            <MdNavigateNext size={30} />
        </div>
    );
};

export const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="absolute left-2 top-1/2 transform bg-base-100 -translate-y-1/2 z-10 cursor-pointer  text-green-900 hover:text-green-700 rounded-full"
            onClick={onClick}
        >
            <MdNavigateBefore size={30} />
        </div>
    );
};