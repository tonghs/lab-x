module.exports = {
  sliceArray(arr, length) {
    // 将数组 arr 拆分成二维数组，每个子数组的长度为 length
    var newArr = []
    for (var i = 0; i < arr.length;){
      newArr.push(arr.slice(i, i + length))
      i = i + length
    }
    return newArr
  }
}