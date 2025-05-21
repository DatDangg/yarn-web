const PageBanner: React.FC<any> = ({ name }) => {
    return (
        <div className="relative py-[40px]">
            <div style={{backgroundImage: `url("/logo.png")`}} className="w-[100%] h-[300px] bg-no-repeat bg-contain bg-center opacity-[0.1]"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-[72px] font-[600] uppercase font-[family-name:var(--font-IMFell)] text-[var(--active-color)]">{name}</div>
        </div>
    )
}

export default PageBanner