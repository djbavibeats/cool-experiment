function Footer() {
    return (
    <div className="h-[45px] bg-black text-white flex flex-row md:flex-row items-center justify-between px-4 text-sm">
      <div className="w-1/3 text-left">
        <p className="text-[10px] md:text-[14px] leading-[12px]">
          <a href="https://justinbavier.com/" target="_blank" rel="noopener">Justin Bavier.</a>
        </p>
      </div>
      <div className="w-1/3  text-center">
        <p className="text-[10px] md:text-[14px] leading-[12px]">
        </p>
      </div>
      <div className="w-1/3  text-right">
        <p className="text-[10px] md:text-[14px] leading-[12px]">
          <a href="https://voltcreative.com" target="_blank" rel="noopener"><strong>Volt Creative.</strong></a>
        </p>
      </div>
    </div>
    )
}

export default Footer