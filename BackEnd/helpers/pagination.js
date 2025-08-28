module.exports =(ojectPagination,query,countRecords)=>{
    if(query.page){
        ojectPagination.currentPage=parseInt(query.page);
    }

    if(query.limit){
        ojectPagination.limitItem=parseInt(query.limit);
    }

    ojectPagination.skip=(ojectPagination.currentPage-1)*ojectPagination.limitItem;

    const totalPage = Math.ceil(countRecords/ojectPagination.limitItem);

    ojectPagination.totalPage=totalPage;

    return ojectPagination;
}