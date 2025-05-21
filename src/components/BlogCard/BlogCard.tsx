interface BlogCardProps {
    title: string,
    image: string,
    category: string
}

const BlogCard:React.FC<BlogCardProps> = ({title, image, category}) => {
    return (
        <>
        <img src={image} className="w-[100%] m-auto block"></img>
        <div className="text-[32px] mt-[8px] font-[family-name:var(--font-Dancing)]">{category}</div>
        <div className="text-[24px] px-[6px] leading-[24px] font-[family-name:var(--font-Gentium)]">{title}</div>
        </>
    )
}

export default BlogCard