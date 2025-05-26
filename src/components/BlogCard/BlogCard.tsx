import { BlogCardProps } from "../../interfaces/blog"

const BlogCard:React.FC<BlogCardProps> = ({title, image, category}) => {
    return (
        <div className="hover:scale-[1.05] hover:cursor-pointer hover:shadow-[0_35px_35px_rgba(0,0,0,0.25)] hover:bg-transparent hover:rounded-[8px]">
            <img src={image} className="w-[100%] m-auto block rounded-tl-[8px] rounded-tr-[8px]"></img>
            <div className="text-[32px] mt-[8px] font-[family-name:var(--font-Dancing)]">{category}</div>
            <div className="text-[24px] pt-[6px] pb-[18px] leading-[24px] font-[family-name:var(--font-Gentium)]">{title}</div>
        </div>
    )
}

export default BlogCard