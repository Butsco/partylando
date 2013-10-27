//
//  ItemsCell.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "ItemsCell.h"

@implementation ItemsCell
@synthesize itemDescription = _itemDescription;
@synthesize itemImage = _itemImage;
@synthesize itemPrice = _itemPrice;


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if(self){
        self.itemImage = [[UIImageView alloc]initWithFrame:CGRectMake(5, 5, 80, 80)];
        self.itemImage.opaque = YES;
        self.itemImage.layer.borderColor = [UIColor blackColor].CGColor;
        self.itemImage.layer.borderWidth = 1;
        
        [self.contentView addSubview: self.itemImage];
        
        self.itemDescription  = [[UILabel alloc]initWithFrame:CGRectMake(0, self.itemImage.frame.size.height*0.7, 80, self.itemImage.frame.size.height*0.3)];
        self.itemDescription.opaque = YES;
        self.itemDescription.textColor = [UIColor blackColor];
        self.itemDescription.backgroundColor = [UIColor orangeColor];
        self.itemDescription.textAlignment = NSTextAlignmentCenter;
        //self.itemDescription.text = @"lalallala";
        [self.itemImage addSubview:self.itemDescription];
        
        self.backgroundColor = [UIColor clearColor];
        self.selectedBackgroundView = [[UIView alloc]initWithFrame:self.itemImage.frame];
        self.selectedBackgroundView.backgroundColor = [UIColor orangeColor];
        
        self.transform = CGAffineTransformMakeRotation(M_PI *0.5);
    }
    
    
    return self;
}

- (NSString*)reuseIdentifier{
    return @"itemCell";
}
@end

/*- (id)initWithFrame:(CGRect)frame
 {
 [super initWithFrame:frame];
 
 self.thumbnail = [[[UIImageView alloc] initWithFrame:CGRectMake(kArticleCellHorizontalInnerPadding, kArticleCellVerticalInnerPadding, kCellWidth - kArticleCellHorizontalInnerPadding * 2, kCellHeight - kArticleCellVerticalInnerPadding * 2)] autorelease];
 self.thumbnail.opaque = YES;
 
 [self.contentView addSubview:self.thumbnail];
 
 self.titleLabel = [[[ArticleTitleLabel alloc] initWithFrame:CGRectMake(0, self.thumbnail.frame.size.height * 0.632, self.thumbnail.frame.size.width, self.thumbnail.frame.size.height * 0.37)] autorelease];
 self.titleLabel.opaque = YES;
 [self.titleLabel setPersistentBackgroundColor:[UIColor colorWithRed:0 green:0.4745098 blue:0.29019808 alpha:0.9]];
 self.titleLabel.textColor = [UIColor whiteColor];
 self.titleLabel.font = [UIFont boldSystemFontOfSize:11];
 self.titleLabel.numberOfLines = 2;
 [self.thumbnail addSubview:self.titleLabel];
 
 self.backgroundColor = [UIColor colorWithRed:0 green:0.40784314 blue:0.21568627 alpha:1.0];
 self.selectedBackgroundView = [[[UIView alloc] initWithFrame:self.thumbnail.frame] autorelease];
 self.selectedBackgroundView.backgroundColor = kHorizontalTableSelectedBackgroundColor;
 
 self.transform = CGAffineTransformMakeRotation(M_PI * 0.5);
 
 return self;
 }*/