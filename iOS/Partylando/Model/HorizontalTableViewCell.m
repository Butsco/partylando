//
//  HorizontalTableViewCell.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "HorizontalTableViewCell.h"
#import "ItemsCell.h"
@implementation HorizontalTableViewCell
@synthesize itemTableview = _itemTableview;
@synthesize items = _items;

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return  _items.count;
}
-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    
    ItemsCell *cell = (ItemsCell*)[tableView dequeueReusableCellWithIdentifier:@"itemCell"];
    if(!cell){
        //cell = [[HorizontalTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"horizontalCell"];
        cell = [[ItemsCell alloc] initWithFrame:CGRectMake(0, 0, 320, 100)];
    }

    NSDictionary *item = [_items objectAtIndex:indexPath.row];
    /*
     dispatch_queue_t concurrentQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
     
     dispatch_async(concurrentQueue, ^{
     UIImage *image = nil;
     image = [UIImage imageNamed:[currentArticle objectForKey:@"ImageName"]];
     
     dispatch_async(dispatch_get_main_queue(), ^{
     [cell.thumbnail setImage:image];
     });
     }); */
    
    
    //cell.itemImage.image = (UIImage *) [item objectForKey:@"image"];
    cell.itemDescription.text = (NSString *)[item objectForKey:@"description"];
    cell.itemPrice.text = (NSString *)[item objectForKey:@"price"];
    //cell.itemPrice =
    
    return cell;
}
-(NSString *)reuseIdentifier{
    return @"horizontalCell";
}

- (id)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    //self = [super initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@""];
    if (self) {
        self.itemTableview = [[UITableView alloc]initWithFrame:CGRectMake(0, 0, 320, 100)];
        self.itemTableview.showsVerticalScrollIndicator = NO;
        self.itemTableview.showsHorizontalScrollIndicator = YES;
        self.itemTableview.transform = CGAffineTransformMakeRotation(-M_PI * 0.5);
        [self.itemTableview setFrame:CGRectMake(0, 0, 320, 100)];
        self.itemTableview.rowHeight = 90;
        self.itemTableview.backgroundColor = [UIColor whiteColor];
        
        self.itemTableview.separatorColor = [UIColor clearColor];
        self.itemTableview.separatorStyle = UITableViewCellSeparatorStyleSingleLine;
        
        self.itemTableview.dataSource = self;
        self.itemTableview.delegate = self;
        [self addSubview:self.itemTableview];
    }
    return self;
}
@end

