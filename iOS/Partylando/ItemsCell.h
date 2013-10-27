//
//  ItemsCell.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ItemsCell : UITableViewCell{
    UIImageView *_itemImage;
    UILabel *_itemDescription;
    UILabel *_itemPrice;
}
@property (nonatomic,strong) UIImageView *itemImage;
@property (nonatomic,strong) UILabel *itemDescription;
@property (nonatomic,strong) UILabel *itemPrice;
@end


