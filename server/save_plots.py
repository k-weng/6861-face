from utils import *

df = get_df()
plot_user_effort(df, save=True)
plot_user_age(df, save=True)
get_user_stats(df, save=True)
plot_accuracy_fpr(df, save=True)
plot_gender_accuracy_fpr(df, expert_filter=False, save=True)
        