from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_auctionitem_max_bid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='auctionitem',
            old_name='min_bid',
            new_name='starting_price',
        ),
        migrations.RenameField(
            model_name='auctionitem',
            old_name='max_bid',
            new_name='ending_price',
        ),
    ]
