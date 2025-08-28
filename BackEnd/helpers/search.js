module.exports =(query)=>{
    let ojectSearch={}

    if(query.keyword){
        const name = new RegExp(query.keyword,"i");
        ojectSearch.name = name;
    }

    // Lọc theo khoảng giá
    if (query.minPrice || query.maxPrice) {
        ojectSearch.price = {};
        if (query.minPrice) {
            ojectSearch.price.$gt = parseInt(query.minPrice); // lớn hơn hoặc bằng
        }
        if (query.maxPrice) {
            ojectSearch.price.$lt = parseInt(query.maxPrice); // nhỏ hơn hoặc bằng
        }
    }
    
    return ojectSearch;
}