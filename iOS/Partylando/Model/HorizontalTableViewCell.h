//
//  HorizontalTableViewCell.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Item.h"

@interface HorizontalTableViewCell : UITableViewCell <UITableViewDelegate, UITableViewDataSource>{
    UITableView *_itemTableview;
}

@property (nonatomic,strong) NSArray *items;
@property (nonatomic,strong) UITableView *itemTableview;

@end
