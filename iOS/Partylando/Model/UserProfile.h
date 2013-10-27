//
//  UserProfile.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <SDWebImage/SDWebImageManager.h>
#import <FacebookSDK/FacebookSDK.h>

@interface UserProfile : NSObject


@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) UIImage *image;
@property (nonatomic, strong) NSString* fbId;

@property (nonatomic, strong) NSDictionary *userPartyData;


-(void) setUserImage:(NSString *)profileImage;
-(NSDictionary *) JSONForUserItems;
@end
