const crypto=require('crypto');
module.exports={
  MD5_SUFFIX: 'jf^0821HUK%^@&9dkofcDFCMW^05492)&MBkpdfeSO8090FP*!_wjJ453Of#[&ad',
  md5: function (str){
      var obj=crypto.createHash('md5');
      obj.update(str);
      return obj.digest('hex');
  }
};
