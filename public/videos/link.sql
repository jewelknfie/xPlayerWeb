-- 按照tv统计不同类型网站top 20 linksite.
mysql> select d.website_domain, count(*) from matchedVideo a, matchedVideo_linkURL b, mddb.trackingWebsite c, mddb.trackingWebsite d where a.company_id = 14 and b.company_id = 14 and a.id = b.matchedVideo_id and a.trackingWebsite_id = c.id and d.id = b.trackingWebsite_id and c.website_type = 'ugc' and a.vddb_title = 'Teen Wolf' group by d.id order by 2 desc limit 20;
+------------------------+----------+
| website_domain         | count(*) |
+------------------------+----------+
| vodly.to               |      596 |
| facebook.com           |      239 |
| dailyflix.net          |      200 |
| allshowsdaily.com      |      140 |
| watchfullepisode.com   |      102 |
| watchflicks.net        |       93 |
| motionempire.me        |       93 |
| watchmoviesonline.mobi |       87 |
| zzstream.li            |       61 |
| 1-linkmovies.com       |       59 |
| watchseriesus.com      |       56 |
| blogspot.com           |       55 |
| channeltvshow.com      |       53 |
| adocine.net            |       53 |
| iwatchonline.to        |       49 |
| direkfilm.org          |       44 |
| tv4stream.com          |       42 |
| filmymegavideo.pl      |       42 |
| cinechulo.com          |       40 |
| youtubeskip.com        |       38 |
+------------------------+----------+
20 rows in set (2.54 sec)


select d.website_domain, e.country_name, sum(case when a.matchedFile_id > 0 then (select count(*) from matchedFileItem c where c.matchedFile_id = a.matchedFile_id) else 1 end) as value from matchedVideo a, matchedVideo_linkURL b, mddb.trackingWebsite d left join country e on d.country_id = e.id  where b.trackingWebsite_id = d.id and a.id = b.matchedVideo_id and a.meta_uuid = '07a5a98c-b9c9-11e3-91bd-90b11c12f2b5' and a.company_id = 34 and b.company_id = 34 group  by d.id order by value desc limit 20;

select d.website_domain, e.country_name, sum(case when a.matchedFile_id > 0 then (select count(*) from matchedFileItem c where c.matchedFile_id = a.matchedFile_id) else 1 end) as value from matchedVideo a, matchedVideo_linkURL b, mddb.trackingWebsite d left join country e on d.country_id = e.id  where b.trackingWebsite_id = d.id and a.id = b.matchedVideo_id and a.meta_uuid = 'eca152c0-bf28-11e3-91bd-90b11c12f2b5' and a.company_id = 34 and b.company_id = 34 group  by d.id order by value desc limit 20;


select d.website_domain, e.country_name, count(*) as value from matchedVideo a, matchedVideo_searchEngine b, mddb.trackingWebsite d left join country e on d.country_id = e.id  where b.trackingWebsite_id = d.id and a.id = b.matchedVideo_id and a.meta_uuid = '07a5a98c-b9c9-11e3-91bd-90b11c12f2b5' and a.company_id = 34 and b.result_source = 'video' and b.company_id = 34 group  by d.id order by null;

select d.website_domain, e.country_name, count(*) as value from matchedVideo a, matchedVideo_searchEngine b, mddb.trackingWebsite d left join country e on d.country_id = e.id  where b.trackingWebsite_id = d.id and a.id = b.matchedVideo_id and a.meta_uuid = 'eca152c0-bf28-11e3-91bd-90b11c12f2b5' and a.company_id = 34 and b.result_source = 'video' and b.company_id = 34 group  by d.id order by null;

select d.website_domain, count(*) from matchedVideo a, matchedVideo_linkURL b, mddb.trackingWebsite c, mddb.trackingWebsite d where a.id = b.matchedVideo_id and a.trackingWebsite_id = c.id and d.id = b.trackingWebsite_id and c.website_type = 'hybrid' group by d.id order by 2 desc limit 100;


select d.website_domain, count(*) from matchedVideo a, matchedVideo_linkURL b, mddb.trackingWebsite c, mddb.trackingWebsite d where a.company_id = 14 and b.company_id = 14 and a.id = b.matchedVideo_id and a.trackingWebsite_id = c.id and d.id = b.trackingWebsite_id group by d.id order by 2 desc ;

select c.website_domain, count(*) from matchedVideo_linkURL b, mddb.trackingWebsite c where b.trackingWebsite_id = c.id group by c.id order by null;

