//
//  Item.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Item : NSObject

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSNumber *price;
@property (nonatomic, strong) UIImage *image;
@property (nonatomic, strong) NSString *SKU;
@property (nonatomic, strong) NSString *category;
@property (nonatomic, strong) NSString *category_detail;

+(NSMutableDictionary *)zalandoData;
-(void) setItemImage:(NSString *)loadImage;
@end
