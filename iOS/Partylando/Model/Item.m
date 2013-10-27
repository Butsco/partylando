//
//  Item.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "Item.h"

@implementation Item

@synthesize name =_name;
@synthesize price =_price;
@synthesize image =_image;
@synthesize category =_category;
@synthesize category_detail =_category_detail;
@synthesize SKU =_SKU;

static NSMutableDictionary *_zalando;

+(NSMutableDictionary *)zalandoData{
    if(!_zalando){
        _zalando = [[NSMutableDictionary alloc]init];
    }
    return _zalando;
}

#pragma mark - SDWebImage
-(void) setItemImage:(NSString *)loadImage{
    if(!loadImage || loadImage.length ==2){
        _image = [UIImage imageNamed:@"noImage"];
    }else{
        [[SDWebImageManager sharedManager]
         downloadWithURL:[NSURL URLWithString:loadImage]
         options:0
         progress:Nil
         completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished)
         {
             if (image)
             {
                 _image = image;
             }
         }];
    }
}

@end
