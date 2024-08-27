import requests
requests.post("http://localhost:65000/profile/OrderGoods",
              json={'goodsName':'Bananas','goods_Quantity':'5','goods_Price':'10','date':'AUG272024'})
# goodsName,goods_Quantity,goods_Price
