select id,website_name, website_type from mddb.trackingWebsite where website_name like '%Glowgaze%';
+-------+--------------+--------------+
| id    | website_name | website_type |
+-------+--------------+--------------+
| 29405 | glowgaze.com | linkingsite  |
+-------+--------------+--------------+
1 row in set (0.06 sec)

mysql> select id,website_name,website_domain, website_type from mddb.trackingWebsite where website_name like '%google%' and website_type not in('linkingsite');
+-------+-----------------------+-----------------------------+--------------+
| id    | website_name          | website_domain              | website_type |
+-------+-----------------------+-----------------------------+--------------+
|   478 | com-google            | google.com                  | searchEngine |
|   594 | googleadsserving.cn   | googleadsserving.cn         | Ad network   |
|   622 | googlesyndication.com | googlesyndication.com       | Ad network   |
|   729 | googleadservices.com  | googleadservices.com        | Ad network   |
| 60054 | drive-google          | drive.google.com            | hybrid       |
| 60302 | picasa-google         | picasaweb.google.com_hybrid | ugc          |
+-------+-----------------------+-----------------------------+--------------+
6 rows in set (0.06 sec)

mysql> select count(*) from matchedVideo_linkURL a, matchedVideo b where a.company_id = 10 and b.company_id = 10 and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and b.trackingWebsite_id = 60054;
+----------+
| count(*) |
+----------+
|        0 |
+----------+
1 row in set (0.01 sec)

mysql> select count(*) from matchedVideo_linkURL a, matchedVideo b where a.company_id = 10 and b.company_id = 10 and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and b.trackingWebsite_id = 60302;
+----------+
| count(*) |
+----------+
|        0 |
+----------+
1 row in set (0.00 sec)
   

glowgaze这个网站只有如下公司有数据, 并且数据量都不多.
mysql> select count(*), company_id from matchedVideo_linkURL where trackingWebsite_id = 29405 group by company_id;
+----------+------------+
| count(*) | company_id |
+----------+------------+
|       24 |          4 |
|       52 |         14 |
|        3 |         99 |
|        1 |       1257 |
|       69 |       1296 |
+----------+------------+
5 rows in set (0.35 sec)

select c.company_name, 'drive-google', count(*) from matchedVideo_linkURL a, matchedVideo b, usermanager.company c where a.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and b.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and c.id = a.company_id and b.trackingWebsite_id = 60054 group by 1;

select c.company_name, 'picasa-google', count(*) from matchedVideo_linkURL a, matchedVideo b, usermanager.company c where a.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and b.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and c.id = a.company_id and b.trackingWebsite_id = 60302 group by 1;

select c.company_name, d.website_name, count(*) from matchedVideo_linkURL a, matchedVideo b, usermanager.company c, mddb.trackingWebsite d where a.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and b.company_id in (8, 10, 4, 55, 20, 99, 14, 1296) and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and c.id = a.company_id and b.trackingWebsite_id in( 60302,60054) and d.id = b.trackingWebsite_id group by 1, 2;

select b.vddb_title, d.website_name, count(*) from matchedVideo_linkURL a, matchedVideo b, usermanager.company c, mddb.trackingWebsite d where a.company_id = 10 and b.company_id =10 and a.matchedVideo_id = b.id and a.trackingWebsite_id = 29405 and c.id = a.company_id and b.trackingWebsite_id in( 60302,60054) and d.id = b.trackingWebsite_id group by 1, 2;

Warner Bros、Fox、Disney、Summit、CBS、Relativity、Paramount、Viacom
8, 10, 4, 55, 20, 99, 14, 1296


