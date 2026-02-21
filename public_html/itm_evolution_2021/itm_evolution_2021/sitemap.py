from main.sitemap import MainStaticViewSitemap
from news.sitemap import NewsStaticViewSitemap, NewsSitemap
from stock.sitemap import StockSitemap, StockStaticViewSitemap
from team.sitemap import TeamSitemap, TeamStaticViewSitemap, WorkoutSitemap

sitemaps = {
    'main_static': MainStaticViewSitemap,
    'news_static': NewsStaticViewSitemap,
    'news': NewsSitemap,
    'stock_static': StockStaticViewSitemap,
    'stock': StockSitemap,
    'team_static': TeamStaticViewSitemap,
    'workout': WorkoutSitemap,
    'team': TeamSitemap,
}
