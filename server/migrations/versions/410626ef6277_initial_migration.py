"""initial migration

Revision ID: 410626ef6277
Revises: 
Create Date: 2024-10-16 15:56:24.939434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '410626ef6277'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('products',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('unit_price', sa.Numeric(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('purchased_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_products'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('username', name=op.f('uq_users_username'))
    )
    op.create_table('costs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('marketing_cost', sa.Numeric(), nullable=False),
    sa.Column('shipping_cost', sa.Numeric(), nullable=False),
    sa.Column('packaging_cost', sa.Numeric(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_costs_product_id_products')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_costs'))
    )
    op.create_table('product_sales',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('unit_sales_price', sa.Numeric(), nullable=False),
    sa.Column('quantity_sold', sa.Integer(), nullable=False),
    sa.Column('sales_profit_margin', sa.Numeric(), nullable=False),
    sa.Column('sale_date', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_product_sales_product_id_products')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_product_sales'))
    )
    op.create_table('profits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('profit_amount', sa.Numeric(), nullable=False),
    sa.Column('margin', sa.Numeric(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], name=op.f('fk_profits_product_id_products')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_profits_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_profits'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('profits')
    op.drop_table('product_sales')
    op.drop_table('costs')
    op.drop_table('users')
    op.drop_table('products')
    # ### end Alembic commands ###
