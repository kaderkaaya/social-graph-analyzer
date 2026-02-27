class CompareService {
  static async compareFollowersFollowing(followers, following) {
    const followersSet = new Set(followers);
    const followingSet = new Set(following);
    //Set bir dizi (Array) değil, bu yüzden klasik JS’te Set.prototype.map yok. map sadece dizilerde var.
    //Bundan dolayı Set'i diziye çevirmek gerekiyor.
    //[...followingSet] bu şekilde Set'i diziye çevirir.
    //[...followersSet] bu şekilde Set'i diziye çevirir.
    //[...followingSet].filter(u => !followersSet.has(u)) bu şekilde Set'i diziye çevirir ve filter ile filtreler.
    //[...followersSet].filter(u => !followingSet.has(u)) bu şekilde Set'i diziye çevirir ve filter ile filtreler.
    const notFollowingBack = [...followingSet].filter(
      (u) => !followersSet.has(u),
    );
    const notFollowedBack = [...followersSet].filter(
      (u) => !followingSet.has(u),
    );
    return { notFollowingBack, notFollowedBack };
  }
}

module.exports = CompareService;
